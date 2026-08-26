export function FigureCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-abu-cream flex flex-col h-full animate-pulse">
      {/* Skeleton de Imagen */}
      <div className="aspect-square w-full bg-gray-200" />
      
      {/* Skeleton de Detalles */}
      <div className="p-3 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-start gap-2">
           {/* Skeleton del título */}
          <div className="h-4 bg-gray-200 rounded-md w-2/3" />
          {/* Skeleton del precio */}
          <div className="h-4 bg-gray-200 rounded-md w-1/4" />
        </div>
        
        {/* Skeleton de la descripción (2 líneas) */}
        <div className="space-y-1 mb-2">
          <div className="h-3 bg-gray-200 rounded-md w-full" />
          <div className="h-3 bg-gray-200 rounded-md w-4/5" />
        </div>
        
        {/* Skeleton de los botones */}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <div className="h-8 bg-gray-200 rounded-lg w-full" />
          <div className="h-8 bg-gray-200 rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
}
