import express from 'express';
import { loginUser} from '../controllers/users.controller.js'; // Asegúrate de que la ruta sea correcta

const router = express.Router();

router.get('/login', (req, res) => {
  res.send("Usá POST para iniciar sesión, genio 😎");
});

router.post('/login',loginUser )
    
// Exportar el router para usarlo en otros archivos
export default router;
