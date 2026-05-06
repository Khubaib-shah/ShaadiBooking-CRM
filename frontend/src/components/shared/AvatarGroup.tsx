interface AvatarGroupProps {
  names: string[]
}

export default function AvatarGroup({ names }: AvatarGroupProps) {
  return (
    <div className="flex -space-x-2">
      {names.slice(0, 5).map((name) => (
        <span
          key={name}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#eef2ff] text-[10px] font-semibold text-[#556ee6]"
          title={name}
        >
          {name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
        </span>
      ))}
    </div>
  )
}

