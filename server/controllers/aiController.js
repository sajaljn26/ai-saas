import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import pdf from 'pdf-parse/lib/pdf-parse.js'

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export const generateArticle = async (req, res) => {
    try {
      const { userId } = req.auth(); // <-- Updated to use req.auth() as function
      const { prompt, length } = req.body;
      const plan = req.plan;
      const free_usage = req.free_usage;
  
      if (plan !== "premium" && free_usage >= 10) {
        return res.json({ success: false, message: "Limit reached. Upgrade to continue." });
      }
  
      const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
          {
            role: "system",
            content:
              "Return the article in valid GitHub-flavored Markdown. Use a clear title, section headings (##), subheadings (###), bullet lists, and numbered lists where helpful. Bold key terms. Avoid front matter."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_completion_tokens: length,
      });
  
      const content = response.choices[0].message.content;
  
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'article')
      `;
  
      if (plan !== "premium") {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: free_usage + 1 }
        });
      }
  
      
      return res.json({ success: true, content });
  
    } catch (error) {
      console.error(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  

  export const generateBlogTitle = async (req, res) => {
    try {
      const { userId } = req.auth(); 
      const { prompt } = req.body;
      const plan = req.plan;
      const free_usage = req.free_usage;
  
      if (plan !== "premium" && free_usage >= 10) {
        return res.json({ success: false, message: "Limit reached. Upgrade to continue." });
      }
  
      const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_completion_tokens: 100,
      });
  
      const content = response.choices[0].message.content;
  
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
      `;
  
      if (plan !== "premium") {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: { free_usage: free_usage + 1 }
        });
      }
  
      
      return res.json({ success: true, content });
  
    } catch (error) {
      console.error(error.message);
      res.json({ success: false, message: error.message });
    }
  };


  export const generateImage = async (req, res) => {
    try {
      const { userId } = req.auth(); 
      const { prompt , publish } = req.body;
      const plan = req.plan;
      
  
      if (plan !== "premium") {
        return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
      }

      const form = new FormData();
      form.append('prompt', prompt);

      const resp = await fetch("https://clipdrop-api.co/text-to-image/v1", {
        method: "POST",
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
        },
        body: form,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`ClipDrop error: ${resp.status} ${text}`);
      }

      const arrayBuffer = await resp.arrayBuffer();
      const base64Image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
      
      const {secure_url} = await cloudinary.uploader.upload(base64Image)
      
      
  
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${secure_url}, 'image')
      `;
  
      
  
      
      return res.json({ success: true, content : secure_url});
  
    } catch (error) {
      console.error(error.message);
      res.json({ success: false, message: error.message });
    }
  };

  
  export const removeImageBackground = async (req, res) => {
    try {
      const { userId } = req.auth(); 
      const {image} = req.file;
      const plan = req.plan;
      
  
      if (plan !== "premium") {
        return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
      }

     

     
      const {secure_url} = await cloudinary.uploader.upload(image.path,{
        transformation : [
            {
                effect : 'background_removal',
                background_removal : "remove_the_background"
            }
        ]
      })
      
      
  
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId},'Remove background from image', ${secure_url}, 'image')
      `;
  
      
  
      
      return res.json({ success: true, content : secure_url});
  
    } catch (error) {
      console.error(error.message);
      res.json({ success: false, message: error.message });
    }
  };


  export const removeImageObject = async (req, res) => {
    try {
      const { userId } = req.auth(); 
      const {image} = req.file;
      const plan = req.plan;
      
  
      if (plan !== "premium") {
        return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
      }

     

     
      const {public_id} = await cloudinary.uploader.upload(image.path)
      
      const imageUrl = cloudinary.url(public_id,{
         transformation : [{effect: `gen_remove:${object}`}],
         resource_type : 'image'
      })
      
  
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId},${`Removed ${object} from image`}, ${imageUrl}, 'image')
      `;
  
      
  
      
      return res.json({ success: true, content : imageUrl});
  
    } catch (error) {
      console.error(error.message);
      res.json({ success: false, message: error.message });
    }
  };

  export const resumeReview = async (req, res) => {
    try {
      const { userId } = req.auth(); 
      const resume = req.file;
      const plan = req.plan;
      
  
      if (plan !== "premium") {
        return res.json({ success: false, message: "This feature is only available for premium subscriptions" });
      }

     if(resume.size > 5 * 1024 * 1024){
        return res.json({success : false,message : "Resume file size exceeds allowed size (5MB)."})
     }

     const dataBuffer = fs.readFileSync(resume.path)
     const pdfData  = await pdf(dataBuffer)

     const prompt = `Review the following resume and provide constructive 
     feedback on its strenghts , weakness ,and the areas for improvement .Resume content:\n\n
     ${pdfData.text}`
     
     const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_completion_tokens: 1000,
      });
  
      const content = response.choices[0].message.content;
     
      
  
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId},"Review the updated resume, ${imageUrl}, 'resume-review')
      `;
  
      
  
      
      return res.json({ success: true, content});
  
    } catch (error) {
      console.error(error.message);
      res.json({ success: false, message: error.message });
    }
  };

