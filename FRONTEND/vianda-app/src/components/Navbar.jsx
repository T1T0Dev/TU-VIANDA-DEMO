
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar (){
    return (
        <nav>
            <div>
                <a href="/">Tu Vianda</a>
                <button type="button">
                    <span></span>
                </button>
                <div>
                    <ul>
                        <li>
                            <a href="/">Venta</a>
                        </li>
                        <li>
                            <a href="/comidas">Comidas</a>
                        </li>
                        <li>
                            <a href="/clientes">Clientes</a>
                        </li>
                        <li>
                            <a href="/pedidos">Pedidos</a>
                        </li>
                        <li>
                            <a href="/historial-ventas">Historial de Ventas</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}