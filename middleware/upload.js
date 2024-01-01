const path = require('path');
const multer = require('multer');

const imageExtensions = ['.png', '.jpg', '.gif', '.jpeg'];
const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'];

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (imageExtensions.includes(ext)) {
            cb(null, path.join(__dirname, '../upload/images/'));
        } else if (documentExtensions.includes(ext)) {
            cb(null, path.join(__dirname, '../upload/docs/'));
        } else {
            cb(new Error('Unsupported file type'));
        }
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, callback) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!imageExtensions.includes(ext) && !documentExtensions.includes(ext)) {
            return callback(new Error('Unsupported file type'));
        } else if (file.size > 2097152) {
            return callback(new Error('File size is too big'));
        }
        
        callback(null, true);
    }, 
    limits: {
        fileSize: 2097152
    }
});

module.exports = upload;
