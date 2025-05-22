import { Link } from "react-router-dom";

const ConnectionCard = ({ item }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col md:flex-row items-start gap-4 p-4 w-full max-w-3xl mx-auto hover:shadow-lg transition-shadow duration-300">
      
      {/* Image */}
      <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item?.photoUrl}
          alt={`${item?.firstname} ${item?.lastname}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {item?.firstname} {item?.lastname}
          </h3>
          <p className="text-gray-600 text-sm leading-snug">
            {item?.about}
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
            View
          </button>
          <Link to={`/chat/${item._id}`}><button className="px-4 py-1.5 text-sm font-medium rounded-md bg-green-500 text-white hover:bg-green-600 transition">
            Message
          </button></Link>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
