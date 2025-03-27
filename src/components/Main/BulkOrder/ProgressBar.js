import $GS from '../../../styles/constants';

const ProgressBar = ({ processedCount, totalCount }) => {
  const progress = !totalCount ? 0 : Math.round((processedCount / totalCount) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">
          {processedCount} of {totalCount} labels processed
        </span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
