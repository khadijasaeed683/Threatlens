export default function ComparisonViewer({
  original,
  annotated
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">

      <div className="bg-slate-900 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 text-sm text-slate-400">
          Original
        </div>

        <img
          src={original}
          alt=""
          className="w-full"
        />
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 text-sm text-slate-400">
          Annotated
        </div>

        <img
          src={`data:image/png;base64,${annotated}`}
          alt=""
          className="w-full"
        />
      </div>

    </div>
  )
}