import classes from "./User.module.scss"
import Avatar from "@/components/Avatar/Avatar"
import Text from "@/components/Text/Text"

export type UserProps = {
  name: string
  description?: string
  avatarSrc?: string
}

function User({
  name,
  description,
  avatarSrc,
}: UserProps) {
  return (
    <div className={classes.root}>
      {/* Avatar loading is not implemented yet. */}
      {null && <Avatar alt={name} src={avatarSrc} />}
      <div className={classes.text}>
        <Text
          variant="body"
          color="text"
        >
          {name}
        </Text>
        {description && (
          <Text
            variant="caption"
            color="muted"
            className={classes.description}
          >
            {description}
          </Text>
        )}
      </div>
    </div>
  )
}

export default User
