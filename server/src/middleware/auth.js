const jwt = require('jsonwebtoken');
module.exports = function auth(req,res,next){const token=(req.headers.authorization||'').replace(/^Bearer\s+/,'');if(!token)return res.status(401).json({message:'Authentication required.'});try{req.admin=jwt.verify(token,process.env.JWT_SECRET||'change-me');next();}catch{res.status(401).json({message:'Session expired. Please sign in again.'});}};
