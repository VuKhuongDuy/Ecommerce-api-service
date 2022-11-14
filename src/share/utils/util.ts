import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

export const generateScreenshotCode = (payload, secretkey: string) => {
  let code = jwt.sign(payload.toString(), secretkey).split('.')[2]
  code = code.replace(/[^a-zA-Z0-9]/g, '')
  return code
}

class Bcrypt {
  private salt: string

  constructor(salt: string) {
    this.salt = salt
  }

  public async generateHashPassword(password: string): Promise<any> {
    const genSalt = await bcrypt.genSalt(Number(this.salt))
    return await bcrypt.hash(password, genSalt)
  }

  public async comparePassword(password: string, hashPassword: string): Promise<any> {
    return await bcrypt.compare(password, hashPassword)
  }
}

export default new Bcrypt(process.env.SALT)
