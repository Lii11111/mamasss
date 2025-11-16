function Cart({ cart, onRemoveItem, onUpdateQuantity, isOpen, onToggle }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Cart Button (Mobile) */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-red-500 text-white p-6 rounded-full shadow-xl z-50 hover:bg-red-600 transition-all duration-200 hover:scale-110 active:scale-95 md:hidden"
      >
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-red-600 text-base font-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-pulse border-2 border-red-500">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>


      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
          {/* Cart Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-5 flex justify-between items-center shadow-lg">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Shopping Cart</span>
              {cart.length > 0 && (
                <span className="bg-white/20 text-white text-sm font-bold px-2.5 py-1 rounded-full">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </h2>
            <button
              onClick={onToggle}
              className="text-white hover:text-gray-100 transition-all p-2 rounded-lg hover:bg-white/20 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 md:p-5">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-7xl mb-6 animate-bounce">🛒</div>
                <p className="text-gray-600 text-xl font-bold mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex gap-4 mb-3">
                      {/* Product Image */}
                      {item.image && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-extrabold text-gray-900 mb-1 text-base truncate">{item.name}</h3>
                            <p className="text-emerald-600 font-bold text-sm">₱{item.price.toFixed(2)} <span className="text-gray-400 font-normal">each</span></p>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                            title="Remove item"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="bg-gradient-to-br from-gray-50 to-white text-emerald-600 border-2 border-emerald-300 w-11 h-11 rounded-xl flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-500 transition-all duration-200 font-black text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="font-black text-gray-900 min-w-[3.5rem] text-center bg-gradient-to-br from-emerald-50 to-white px-4 py-2.5 rounded-xl border-2 border-emerald-200 text-lg">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="bg-gradient-to-br from-gray-50 to-white text-emerald-600 border-2 border-emerald-300 w-11 h-11 rounded-xl flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-500 transition-all duration-200 font-black text-lg hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                      >
                        +
                      </button>
                      <div className="ml-auto text-right">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">Subtotal</p>
                        <p className="font-black text-2xl text-emerald-600">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t-2 border-gray-200 p-5 bg-gradient-to-b from-white via-emerald-50/30 to-white shadow-2xl">
            <div className="flex justify-between items-center mb-4 p-5 bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl shadow-lg border-2 border-emerald-200/50">
              <div>
                <span className="text-sm text-gray-500 font-medium block mb-1">Total Amount</span>
                <span className="text-lg font-bold text-gray-700">Total:</span>
              </div>
              <span className="text-4xl font-black text-emerald-600">₱{total.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white py-4 rounded-2xl font-black text-lg hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-600 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-3 transform hover:scale-105"
              disabled={cart.length === 0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Checkout</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}

export default Cart;

