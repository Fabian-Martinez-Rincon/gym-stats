export default function Loading() {
  return (
    <div className="mx-auto flex max-w-4xl items-center justify-center px-3 py-16 lg:px-4">
      <div role="status" aria-label="Cargando" className="h-6 w-6 animate-spin rounded-full border-2 border-(--line) border-t-(--brand)" />
    </div>
  );
}
