const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full">
        {/* Nút đóng */}
        <button
          className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
          onClick={onClose}
        >
          x
        </button>
        {/* Ảnh to */}
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;
