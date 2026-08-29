import { CaretDown } from "@phosphor-icons/react/ssr";

type Props = {
  label: string;
  devices: MediaDeviceInfo[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function DeviceSelect({ label, devices, value, onChange, disabled }: Props) {
  return (
    <label className="block text-left">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-neutral-500 dark:text-zinc-400">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          disabled={disabled || devices.length < 2}
          onChange={(event) => onChange(event.target.value)}
          className="h-14 w-full appearance-none truncate rounded-2xl border-2 border-neutral-200/90 bg-white px-4 pr-10 text-sm font-bold text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-4 focus:ring-neutral-200/50 disabled:text-neutral-400 dark:border-white/15 dark:bg-[#141414] dark:text-white dark:focus:border-white/40 dark:focus:ring-white/10 dark:disabled:text-zinc-500 shadow-sm"
        >
          {devices.length === 0 && <option value="">No device found</option>}
          {devices.map((device, index) => (
            <option
              value={device.deviceId}
              key={device.deviceId || index}
              className="bg-white text-neutral-900 dark:bg-[#141414] dark:text-white font-semibold"
            >
              {device.label || `${label} ${index + 1}`}
            </option>
          ))}
        </select>
        <CaretDown className="pointer-events-none absolute right-4 top-5 text-neutral-400 dark:text-zinc-400" size={16} weight="bold" />
      </span>
    </label>
  );
}
