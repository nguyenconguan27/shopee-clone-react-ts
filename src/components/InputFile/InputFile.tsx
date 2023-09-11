import React, { Fragment, useRef } from 'react'
import config from 'src/constants/config'
import { toast } from 'react-toastify'

type Props = {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= config.maxFileSize || !fileFromLocal.type.includes('image'))) {
      toast.error('Dụng lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG')
    } else {
      onChange && onChange(fileFromLocal)
    }
  }
  const handleUpload = () => {
    inputRef.current?.click()
  }
  return (
    <Fragment>
      <div>
        <input
          type='file'
          className='hidden'
          accept='.jpg, .jpeg, .png'
          ref={inputRef}
          onChange={onFileChange}
          onClick={(event) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(event.target as any).value = null
          }}
        />
        <button
          className='px-3 py-2 border border-black/10 mt-3 hover:bg-neutral-100'
          type='button'
          onClick={handleUpload}
        >
          Chọn ảnh
        </button>
      </div>
    </Fragment>
  )
}
