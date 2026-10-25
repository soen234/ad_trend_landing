import StoreButtons from '@/components/StoreButtons';

interface EmptyStateProps {
  title: string;
  description: string;
  showStoreButtons?: boolean;
  children?: React.ReactNode;
}

export default function EmptyState({ title, description, showStoreButtons = true, children }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-panel px-5 py-10 text-center sm:px-10">
      <h2 className="text-xl font-semibold text-fg">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-subtle">{description}</p>
      {children}
      {showStoreButtons && <StoreButtons className="mt-6" align="center" />}
    </div>
  );
}
