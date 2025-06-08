// src/components/pages/components/ProductTable.js
import React from 'react';
import { 
  Edit2, 
  Tag, 
  CheckCircle, 
  XCircle,
  Package,
  Plus
} from 'lucide-react';
import { formatDate, getPriceDisplay, formatPrice } from '../../../utils/formatters';

const ProductTable = ({ 
  products, 
  onEditProduct, 
  onAddProduct,
  hasActiveFilters,
  clearAllFilters 
}) => {
  // Mobile Card View Component
  const MobileCard = ({ product }) => (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono text-gray-500">#{product.id}</span>
            {product.isActive ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                <XCircle className="w-3 h-3 mr-1" />
                Inactive
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
        </div>
        <button
          onClick={() => onEditProduct(product)}
          className="ml-2 text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
          title="Edit product"
        >
          <Edit2 size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Category:</span>
          <div className="mt-1">
            {product.category ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                <Tag className="w-3 h-3 mr-1" />
                {product.category.name}
              </span>
            ) : (
              <span className="text-gray-400 text-xs">No category</span>
            )}
          </div>
        </div>
        
        <div>
          <span className="text-gray-500">Price:</span>
          <div className="font-semibold text-orange-600 mt-1">
            {getPriceDisplay(product)}
          </div>
          {product.hasVariants && (
            <div className="text-xs text-gray-500">
              Base: {formatPrice(product.price)}
            </div>
          )}
        </div>
        
        {product.hasVariants && (
          <div className="col-span-2">
            <span className="text-gray-500">Variants:</span>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {product.variants.length} total, {product.activeVariantsCount} active
              </span>
            </div>
          </div>
        )}
      </div>
      
      {product.updatedAt && (
        <div className="mt-2 text-xs text-gray-500">
          Updated: {formatDate(product.updatedAt)}
        </div>
      )}
    </div>
  );

  // Desktop Table Row Component
  const TableRow = ({ product }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-4 lg:px-6">
        <span className="text-sm font-mono text-gray-600">
          #{product.id}
        </span>
      </td>
      <td className="py-4 px-4 lg:px-6">
        <div className="font-semibold text-gray-800 text-sm lg:text-base">
          {product.name}
        </div>
        {product.updatedAt && (
          <div className="text-xs text-gray-500">
            Updated: {formatDate(product.updatedAt)}
          </div>
        )}
      </td>
      <td className="py-4 px-4 lg:px-6">
        {product.category ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            <Tag className="w-3 h-3 mr-1" />
            {product.category.name}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">No category</span>
        )}
      </td>
      <td className="py-4 px-4 lg:px-6">
        <div>
          <span className="font-semibold text-orange-600 text-sm lg:text-base">
            {getPriceDisplay(product)}
          </span>
          {product.hasVariants && (
            <div className="text-xs text-gray-500">
              Base: {formatPrice(product.price)}
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-4 lg:px-6">
        {product.hasVariants ? (
          <div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {product.variants.length} total
            </span>
            <div className="text-xs text-gray-500 mt-1">
              {product.activeVariantsCount} active
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No variants</span>
        )}
      </td>
      <td className="py-4 px-4 lg:px-6">
        {product.isActive ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-xs">Active</span>
          </div>
        ) : (
          <div className="flex items-center text-red-500">
            <XCircle className="w-4 h-4 mr-1" />
            <span className="text-xs">Inactive</span>
          </div>
        )}
      </td>
      <td className="py-4 px-4 lg:px-6">
        <button
          onClick={() => onEditProduct(product)}
          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
          title="Edit product"
        >
          <Edit2 size={16} />
        </button>
      </td>
    </tr>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center py-12 px-4">
      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasActiveFilters
          ? 'No matching products found'
          : 'No products found'
        }
      </h3>
      <p className="text-gray-500 mb-4 text-sm">
        {hasActiveFilters
          ? 'Try adjusting your filters or search terms'
          : 'Start by adding your first product to the menu'
        }
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-flex items-center justify-center"
          >
            Clear Filters
          </button>
        )}
        <button
          onClick={onAddProduct}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>
    </div>
  );

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Mobile Card View */}
      <div className="block md:hidden">
        <div className="divide-y divide-gray-200">
          {products.map((product) => (
            <MobileCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">ID</th>
              <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Name</th>
              <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Category</th>
              <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Price</th>
              <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Variants</th>
              <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Status</th>
              <th className="text-left py-3 px-4 lg:px-6 font-semibold text-gray-800 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <TableRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;