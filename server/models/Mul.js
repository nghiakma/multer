import mongoose from 'mongoose';

const MulSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Tên file
    },
    file: {
        type: String,
        required: true   // Đường dẫn hoặc tên file ảnh/video
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now  // Thời gian tạo
    }
})

const MulModel = mongoose.model('muls', MulSchema)

export default MulModel; 