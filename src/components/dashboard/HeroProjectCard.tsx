import Card from "../../components/ui/Card";
import React from "react";

interface HeroProjectCardProps {
  imageSrc: string;
  priorityLabel?: string;
  title: string;
  description: string;
  className?: string;
}

const HeroProjectCard: React.FC<HeroProjectCardProps> = ({
  imageSrc,
  priorityLabel = "Priority One",
  title,
  description,
  className = "",
}) => {
  return (
    <Card
      className={`relative overflow-hidden group border-0 shadow-2xl min-h-[360px] ${className}`}
      noPadding
    >
      <img
        src={imageSrc}
        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
        alt={`${title} - ${description}`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
            {priorityLabel}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-md leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default HeroProjectCard;
