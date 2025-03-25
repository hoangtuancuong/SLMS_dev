import { Tag } from '@/app/utils/api_model';
import { SubjectData } from '@/app/utils/constant';

export const SubjectImage = (props: { tag: Tag }) => {
  return (
    <img
      src={SubjectData.find((image) => image.id === props.tag.id)?.image}
      alt={props.tag.name}
      className="w-full object-cover hover:scale-[115%] duration-300 cursor-pointer rounded-t-sm"
    />
  );
};
