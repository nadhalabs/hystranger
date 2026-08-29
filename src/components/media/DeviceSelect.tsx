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
      <span className="mb-1.5 block text-xs font-semibold text-neutral-500 dark:text-zinc-400">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          disabled={disabled || devices.length < 2}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none truncate rounded-xl border border-neutral-200/80 bg-white px-3 pr-9 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 focus:ring-4 focus:ring-neutral-200/50 disabled:text-neutral-400 dark:border-white/10 dark:bg-[#151515] dark:text-white dark:focus:border-white/30 dark:focus:ring-white/5 dark:disabled:text-zinc-500"
        >
          {devices.length === 0 && <option value="">No device found</option>}
          {devices.map((device, index) => (
            <option
              value={device.deviceId}
              key={device.deviceId || index}
              className="bg-white text-neutral-900 dark:bg-[#151515] dark:text-white"
            >
              {device.label || `${label} ${index + 1}`}
            </option>
          ))}
        </select>
        <CaretDown className="pointer-events-none absolute right-3 top-3.5 text-neutral-400 dark:text-zinc-400" size={15} />
      </span>
    </label>
  );
}
