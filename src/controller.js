import { parse } from 'csv-parse/sync';
import { GoogleGenAI } from '@google/genai';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

export const processSalesData = async (req, res) => {
    try {
        const file = req.file;
        const email = req.body.email;

        if (!file || !email) {
            return res.status(400).json({ error: 'Missing required fields: file or email.' });
        }

        const csvString = file.buffer.toString('utf-8');
        const records = parse(csvString, {
            columns: true,
            skip_empty_lines: true
        });

        const prompt = `
        You are an expert data analyst. Review the following Q1 sales data provided in JSON format. 
        Write a concise, professional executive summary highlighting total revenue, top performing regions, and any negative anomalies.
        Format the output using standard HTML tags (like <p>, <strong>, <ul>) suitable for an email body.
        
        Data: ${JSON.stringify(records)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        let summaryHtml = response.text;

        if (!summaryHtml) {
            throw new Error("AI failed to generate a response.");
        }
summaryHtml = summaryHtml
    .replace(/```html/gi, '')
    .replace(/```/g, '')
    .trim();

        const emailResponse = await resend.emails.send({
            from: 'Sales Automator <onboarding@resend.dev>', 
            to: email,
            subject: 'Q1 Sales Executive Summary',
            html: summaryHtml
        });

        if (emailResponse.error) {
            console.error("Email API Error:", emailResponse.error);
            return res.status(502).json({ error: 'Failed to dispatch email.' });
        }

        res.status(200).json({ message: 'Summary generated and dispatched successfully.' });

    } catch (error) {
        console.error('System Failure in processSalesData:', error.message);
        res.status(500).json({ error: 'Internal server error during processing.' });
    }
};