import express from 'express';
import { loginUser} from '../controllers/users.controller.js'; // Asegúrate de que la ruta sea correcta

const router = express.Router();


router.post('/login',loginUser )
    
// Exportar el router para usarlo en otros archivos
export default router;
