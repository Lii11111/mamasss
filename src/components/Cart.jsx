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

      {/* Cart Button (Desktop) */}
      <button
        onClick={onToggle}
        className="hidden md:flex md:fixed md:top-[90px] md:right-4 bg-red-500 text-white px-8 py-3 rounded-lg shadow-lg z-50 hover:bg-red-600 transition-all duration-200 items-center gap-3 min-w-[180px]"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="font-semibold text-lg">Cart</span>
        {cart.length > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold rounded-full px-3 py-1.5 min-w-[2rem] flex items-center justify-center shadow-md">
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
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="bg-emerald-500 text-white p-5 flex justify-between items-center shadow-md">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🛒</span>
              Shopping Cart
            </h2>
            <button
              onClick={onToggle}
              className="text-white hover:text-stone-100 transition-colors p-1 rounded-lg hover:bg-emerald-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="bg-stone-50 rounded-lg p-4 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-emerald-600 font-semibold">₱{item.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="bg-white text-emerald-600 border-2 border-emerald-300 w-9 h-9 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-400 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="font-bold text-gray-800 min-w-[2.5rem] text-center bg-white px-3 py-1.5 rounded-lg border border-stone-200">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="bg-white text-emerald-600 border-2 border-emerald-300 w-9 h-9 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-400 transition-all font-bold"
                      >
                        +
                      </button>
                      <div className="ml-auto">
                        <p className="font-bold text-lg text-emerald-600">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="border-t border-stone-200 p-5 bg-stone-50">
            <div className="flex justify-between items-center mb-5 p-4 bg-white rounded-lg shadow-sm border border-stone-200">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-3xl font-bold text-emerald-600">₱{total.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-emerald-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95"
              disabled={cart.length === 0}
            >
              💳 Checkout
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

