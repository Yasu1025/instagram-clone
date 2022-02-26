import React, { memo, VFC } from 'react'
import { Auth } from '../auth/Auth'

export const Core: VFC = memo(() => {
  return (
    <div>
      <Auth />
    </div>
  )
})
