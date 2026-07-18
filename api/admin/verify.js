import { timingSafeEqual } from 'node:crypto';

function passwordsMatch(value, expected) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer);
}

export default function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Metodo nao permitido.' });
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;
  const password = request.body?.password;

  if (!expectedPassword) {
    console.error('ADMIN_PASSWORD nao configurada na Vercel.');
    return response.status(500).json({ error: 'Configuracao de administrador indisponivel.' });
  }

  const valid = typeof password === 'string' && passwordsMatch(password, expectedPassword);
  return response.status(valid ? 200 : 401).json({ valid });
}
