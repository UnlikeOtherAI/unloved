interface Props {
  url: string
}

export default function PreviewPanel({ url }: Props) {
  return (
    <iframe
      src={url}
      title="Preview"
      className="h-full w-full border-0"
    />
  )
}
