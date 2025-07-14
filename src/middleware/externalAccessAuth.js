const dotenv = require('dotenv');
const path = require('path');
const { ApiResponse } = require('../models/apiResponse');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function externalAccessAuth(req, res, next) {
    const funcTag = '[externalAccess]';
    const validToken = process.env.API_TOKEN;
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log(`${funcTag} Acesso não autorizado - header ausente`);
         const resp = new ApiResponse(401, 'Token de acesso inválido');
        return res.status(resp.status).json(resp);
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || token !== validToken) {
        console.log(`${funcTag} Tentativa de acesso com token inválido`);
        const resp = new ApiResponse(403, 'Token de acesso inválido');
        return res.status(resp.status).json(resp);
    }

    console.log(`${funcTag} Token valido`);
    next();
};

module.exports = { externalAccessAuth };