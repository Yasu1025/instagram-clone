export interface File extends Blob {
  readonly lastModified: number
  readonly name: string
}

export interface Profile {
  id: number
  nickName: string
  userProfile: number
  created_on: string
  img: string
}

// For authSlice.ts
export interface PROPS_AUTH {
  email: string
  password: string
}

export interface PROPS_PROFILE {
  id: number
  nickname: string
  img: File | null
}

export interface PROPS_NICKNAME {
  nickname: string
}
