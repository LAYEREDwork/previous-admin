interface EditorFieldPartialProps {
    label: string;
    children: React.ReactNode;
}

export function EditorFieldPartial({ label, children }: EditorFieldPartialProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-6 items-start sm:items-center">
            <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 sm:text-right sm:pr-4">{label}</label>
            <div className="sm:col-span-2 sm:w-[75%]">{children}</div>
        </div>
    );
}
