import bcrypt from 'bcryptjs'

const password = process.argv[2] || 'admin123'

async function generateHash() {
  const hash = await bcrypt.hash(password, 10)
  console.log('\nPassword:', password)
  console.log('Hash:', hash)
  console.log('\nUse this hash in your D1 migration SQL\n')
}

generateHash()
