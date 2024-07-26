
[![kicktalk](https://github.com/user-attachments/assets/e0c0c1ed-53f2-4a26-8a3f-5373bb397efb)](https://kicktalk-client.vercel.app)
# KickTalk - Twitter Clone MERN App

## Introduction

KickTalk is a social media web app designed for Football fans to share their thoughts, view live match fixtures and tons of data.

## Tech Stack

- Node.js
- React.js
- Redis
- MongoDB
- Socket.io
- TailwindCSS

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/alex-melia/kicktalk-app
```

2. **Install dependencies**

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

3. **Set up & edit environment variables**

Specify environment variables
I used cloudinary to store images, feel free to use your choice of storage

```bash
cd frontend
cp .env.example .env.development
cp .env.example .env.production
```

```bash
cd backend
cp .env.example config.env
```

## Running the App

1. **Starting client and server**

```bash
cd frontend
npm run dev
```

```bash
cd backend
npm run start
```
