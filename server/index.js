import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import connectDB from './db.js'
import MulModel from './models/Mul.js';
import fs from 'fs';
export const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Cấu hình multer để lưu hình ảnh và video
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Kiểm tra định dạng file, nếu là ảnh thì lưu vào thư mục Images, nếu là video thì lưu vào Videos
        const fileType = file.mimetype.split('/')[0]; // Kiểm tra xem là image hoặc video
        if (fileType === 'image') {
            cb(null, 'public/Images');
        } else if (fileType === 'video') {
            cb(null, 'public/Videos');
        } else {
            cb(new Error('File không hợp lệ'), false);
        }
    },
    filename: (req, file, cb) => {
        // Lưu file với tên duy nhất dựa trên thời gian hiện tại
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

// Cấu hình multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1073741824 }, // Giới hạn dung lượng file (ví dụ: 100MB)
    fileFilter: (req, file, cb) => {
        // Chỉ chấp nhận hình ảnh và video
        const fileType = file.mimetype.split('/')[0];
        if (fileType === 'image' || fileType === 'video') {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận hình ảnh và video'));
        }
    }
});

// API để upload hình ảnh hoặc video
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file)
  
        // Lưu trữ thông tin vào MongoDB
        MulModel.create({
            name: req.file.originalname,
            file: req.file.filename,  // Lưu file dưới dạng base64
            type: req.file.mimetype  // Lưu loại file (image hoặc video)
        })
        .then(result => res.json(result))
        .catch(err => console.log(err));
  
});

 
// API để lấy danh sách hình ảnh hoặc video
app.get('/getMedia', (req, res) => {
    MulModel.find()
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

// Khởi động server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
    connectDB();
})


// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(cors()); // Cho phép kết nối từ frontend

// // Tạo thư mục nếu chưa tồn tại
// const createUploadsDir = () => {
//   if (!fs.existsSync('uploads')) {
//     fs.mkdirSync('uploads');
//   }
//   if (!fs.existsSync('uploads/images')) {
//     fs.mkdirSync('uploads/images');
//   }
//   if (!fs.existsSync('uploads/videos')) {
//     fs.mkdirSync('uploads/videos');
//   }
// };
// createUploadsDir();

// // Cấu hình lưu file tùy theo loại file (ảnh hoặc video)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Kiểm tra loại file để lưu vào thư mục tương ứng
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, 'uploads/images');
//     } else if (file.mimetype.startsWith('video/')) {
//       cb(null, 'uploads/videos');
//     } else {
//       cb(new Error('File không hợp lệ'), null);
//     }
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Đặt tên file có thêm timestamp để tránh trùng lặp
//   }
// });

// const upload = multer({ storage: storage });

// // Route để upload cả ảnh và video cùng lúc
// app.post('/upload-files', upload.fields([{ name: 'image' }, { name: 'video' }]), (req, res) => {
//   if (!req.files || (!req.files.image && !req.files.video)) {
//     return res.status(400).send({ message: 'Chưa chọn ảnh hoặc video!' });
//   }

//   res.send({
//     message: 'Ảnh và video đã được upload thành công!',
//     files: req.files
//   });
// });

// // Khởi động server
// app.listen(5000, () => {
//   console.log('Server đang chạy trên cổng 5000');
// });
