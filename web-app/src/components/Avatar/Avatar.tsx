import classes from "./Avatar.module.scss"

export type AvatarProps = {
  src?: string
  alt?: string
}

function Avatar({
  src,
  alt,
}: AvatarProps) {
  return (
    <span className={classes.root}>
      {src && <img src={src} alt={alt}/>}
    </span>
  )
}

export default Avatar
