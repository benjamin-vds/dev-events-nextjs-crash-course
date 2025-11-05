import { IEventDetailItem } from "@/lib/model/ievent.model";
import Image from "next/image";

const EventDetailItem = ({ icon, alt, label }: IEventDetailItem) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};
export default EventDetailItem;
