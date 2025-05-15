import React from 'react';
import '../styles/Register.css';

const Register = () => {
  return (
    <div className="register-container">
      <form className="register-form">
        <h2>Registrarse</h2>
        <div>
          <label htmlFor="username">Usuario</label>
          <input type="text" id="username" name="username" required autoComplete="username" />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" required autoComplete="new-password" />
        </div>
        <button type="submit">Registrar</button>
        <a className='login' href="/">¿Ya tienes cuenta? Iniciar sesión</a>
      </form>
    </div>
  );
};

export default Register;
