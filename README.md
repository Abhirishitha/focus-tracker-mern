# 🔥 Focus Tracker (MERN + Chrome Extension)

A full-stack productivity tracking system that monitors website usage in real time and classifies it into productive and distracting categories using rule-based logic with optional AI fallback.

---

## 🚀 Features

- Secure authentication using JWT
- Email-based OTP verification
- Chrome Extension for real-time website tracking
- Interactive dashboard with analytics (Pie & Bar charts)
- User-defined productive and distracting websites
- Automatic classification for unknown websites

---

## 🛠 Tech Stack

- **Frontend:** React (Vite + TypeScript)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Visualization:** Recharts
- **Extension:** Chrome Extension (Manifest v3)

---

## 📁 Project Structure

```
focus-tracker/
├── client/        # React frontend
├── server/        # Node.js backend
├── extension/     # Chrome extension
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Abhirishitha/focus-tracker-mern.git
cd focus-tracker-mern
```

---

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/` with:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

Run the server:

```bash
node index.js
```

---

### 3. Frontend setup

```bash
cd ../client/focus-tracker
npm install
npm run dev
```

---

### 4. Chrome Extension

- Open `chrome://extensions`
- Enable **Developer Mode**
- Click **Load unpacked**
- Select the `extension/` folder

---

## 📊 Usage

1. Sign up and verify email using OTP  
2. Log in and complete initial setup  
3. Open and switch between websites  
4. View real-time tracking and analytics on the dashboard  

---

## 📸 Screenshots

_Add screenshots of login, setup, dashboard, and charts here_

---

## 🌐 Deployment

### Backend (Render)

- Build command: `npm install`
- Start command: `node server/index.js`
- Add environment variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `EMAIL_USER`
  - `EMAIL_PASS`

---

### Frontend (Vercel)

- Set root directory: `client/focus-tracker`
- Update API URLs in frontend:

```
http://localhost:5000 → https://your-backend-url
```

---

## 🔌 Notes

- The Chrome Extension runs locally and is not deployed to the Chrome Web Store
- `node_modules` and `.env` are excluded from version control

---

## 🙌 Author

**Abhirishitha**

---

## 📌 License

This project is for educational purposes.
