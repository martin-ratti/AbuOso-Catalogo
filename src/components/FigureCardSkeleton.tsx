export function FigureCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-abu-cream/80 flex flex-col h-full animate-pulse">
      {/* Skeleton de Imagen */}
      <div className="aspect-[4/5] w-full bg-gray-200/80" />
      
      {/* Skeleton de Detalles */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1 gap-2">
        {/* Skeleton del título */}
        <div className="h-4 bg-gray-200/80 rounded-md w-4/5" />
        {/* Skeleton del precio */}
        <div className="h-5 bg-gray-200/80 rounded-md w-1/3" />
        
        {/* Skeleton de los botones */}
        <div className="mt-auto pt-1.5 grid grid-cols-2 gap-1.5 sm:gap-2">
          <div className="h-8 bg-gray-200/80 rounded-xl w-full" />
          <div className="h-8 bg-gray-200/80 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
