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

export interface Post {
  id: number
  title: string
  userPost: number
  created_on: string
  img: string
  liked: number[]
}

export interface Comment {
  id: number
  text: string
  userComment: number
  post: number
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

// For postSlice.ts
export interface PROPS_NEW_POST {
  title: string
  img: File | null
}

export interface PROPS_LIKED {
  id: number
  title: string
  current: number[]
  new: number
}

export interface PROPS_COMMENT {
  text: string
  post: number
}

export interface PROPS_POST {
  postId: number
  loginId: number
  userPost: number
  title: string
  imageURL: string
  liked: number[]
}
