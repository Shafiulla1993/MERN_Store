import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage });

export default upload;

// hyqmpptmd
// 954497672891476
// 8B_w6l0iEEbuEPVWgJzgF0tB7Vm
