const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags &&
      tags.length > 0 &&
      tags.map((tag) => (
        <div className="pill" key={tag}>
          {tag}
        </div>
      ))}
  </div>
);
export default EventTags;
