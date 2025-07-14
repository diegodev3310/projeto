function validadeEmail(email) {
  if (typeof email !== 'string') {
    throw new Error('O email deve ser uma string');
  }
  
  if (email.length < 5 || email.length > 254) {
    throw new Error('O email deve ter entre 5 e 254 caracteres');
  }
  
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { validadeEmail };