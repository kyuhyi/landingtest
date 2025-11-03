interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
}

export default function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="bg-[var(--color-gray-900)] border-b border-[var(--color-gray-800)] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="text-sm text-[var(--color-gray-400)] mb-4">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-white">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="mx-2">&gt;</span>}
            </span>
          ))}
        </nav>
        <h1 className="text-4xl lg:text-5xl font-bold">{title}</h1>
        {description && (
          <p className="mt-4 text-lg text-[var(--color-gray-400)] max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
