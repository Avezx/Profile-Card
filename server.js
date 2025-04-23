const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const axios = require('axios');
const app = express();

const GITHUB_USERNAME = 'avezx';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=3`;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const avatarPath = path.join(__dirname, 'avatar.jpg');
let avatarBase64 = '';

const avatar = fs.readFileSync(avatarPath);
avatarBase64 = avatar.toString('base64');

const quotes = [
  {
    lines: [
      "Two kinds of people here:",
      "me who caused the bug,",
      "and someone who reads it"
    ]
  },
  {
    lines: [
      "There are two kinds of people:",
      "those who document their code,",
      "and me."
    ]
  },
  {
    lines: [
      "I don't promise gold.",
      "I promise code that runs.",
      "Sometimes."
    ]
  },
  {
    lines: [
      "I don't always test my code,",
      "but when I do,",
      "I do it in production."
    ]
  }, {
  lines: [
  "Some folks code for glory,",
  "some for gold.",
  "I code for both, partner."
]
},

];

app.get('/account', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching account information:', error.message);
    res.status(500).json({ error: 'Failed to fetch account information' });
  }
});

app.get('/badge.svg', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      },
    );

    const {
      login,
      name,
      public_repos,
      followers,
      following,
      created_at,
      updated_at,
      public_gists,
      location,
      company,
      blog,
      twitter_username,
      bio,
    } = response.data;

    const createdDate = new Date(created_at).toLocaleDateString();
    const lastUpdated = new Date(updated_at).toLocaleDateString();

    res.setHeader('Content-Type', 'image/svg+xml');

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteLines = randomQuote.lines.map((line, index) =>
      `<tspan x="410" dy="${index === 0 ? '0' : '24'}">${line}</tspan>`
    ).join('\n              ');

    const svg = `
        <svg width="800" height="650" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(100,0)">
             <defs>
                <clipPath id="roundedImage">
                     <circle cx="400" cy="200" r="100"/>
                </clipPath>
                <style type="text/css">
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&amp;display=swap');
                </style>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/>
                </filter>
            </defs>

            <!-- Avatar Background Circle -->
            <rect
                fill="#1c1a18" 
                x="297.5"
                y="97.5"
                width="205"
                height="205"
                rx="110"
                ry="110"
            />




            <!-- Main Background -->
            <rect 
                x="150" 
                y="200" 
                width="500" 
                height="440" 
                fill="#1c1a18" 
                rx="20"
                ry="20"
                filter="url(#shadow)"
            />

            <!-- Avatar Section -->
            <image
                x="300"
                y="100"
                width="200"
                height="200"
                clip-path="url(#roundedImage)"
                href="data:image/jpeg;base64,${avatarBase64}"
            />

            <!-- Username and Tags Section -->
            <text x="400" y="350" font-size="40" text-anchor="middle" fill="#D4AF37" 
                  font-family="JetBrains Mono, monospace" font-weight="bold" filter="url(#shadow)">${login}</text>
             

            <!-- Rest of the content with adjusted y-coordinates -->
            <rect x="310" y="370" width="180" height="24" rx="12" ry="12" fill="#5D3A00" filter="url(#shadow)"/>
            <text x="400" y="387" fill="white" font-size="14px" text-anchor="middle" 
                  font-weight="600" font-family="JetBrains Mono, monospace">🕯️ First Repo in 2019</text>

            <rect x="305" y="405" width="190" height="24" rx="12" ry="12" fill="#7B241C" filter="url(#shadow)"/>
            <text x="400" y="422" fill="white" font-size="14px" text-anchor="middle" 
                  font-weight="600" font-family="JetBrains Mono, monospace">💥 CSS Trauma Survivor</text>
                  
            <rect x="300" y="440" width="200" height="24" rx="12" ry="12" fill="#634f38" filter="url(#shadow)"/>
            <text x="400" y="457" fill="white" font-size="14px" text-anchor="middle" 
                  font-weight="600" font-family="JetBrains Mono, monospace">📜 Stack Overflow Oracle</text>

            <text x="410" y="517" fill="#a89c8f" font-size="28px" text-anchor="middle" font-weight="600" font-family="JetBrains Mono, monospace">
              ${quoteLines}
            </text>

 
            
  <g transform="translate(160,210)scale(0.5)">
    <circle cx="20" cy="20" r="15" fill="#666" stroke="#444" stroke-width="2"/>
    <rect x="8" y="18" width="24" height="4" fill="#444"/>
  </g>
  
    <g transform="translate(620,210)scale(0.5)">
    <circle cx="20" cy="20" r="15" fill="#666" stroke="#444" stroke-width="2"/>
    <rect x="8" y="18" width="24" height="4" fill="#444"/>
  </g>


            <!-- Footer -->
            <text x="400" y="620" font-size="14" text-anchor="middle" fill="#9e928b" 
                  font-family="JetBrains Mono, monospace">Joined: ${createdDate}</text>
                  </g>
        </svg>
    `;

    res.send(svg);
  } catch (error) {
    console.error('Error generating badge:', error);
    res.status(500).send('Error generating badge');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
