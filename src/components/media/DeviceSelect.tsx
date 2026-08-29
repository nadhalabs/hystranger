import { CaretDown } from "@phosphor-icons/react/ssr";

type Props = { label: string; devices: MediaDeviceInfo[]; value: string; onChange: (value: string) => void; disabled?: boolean };

export function DeviceSelect({ label, devices, value, onChange, disabled }: Props) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-xs font-semibold text-zinc-400">{label}</span>
      <span className="relative block">
        <select
          value={value}
          disabled={disabled || devices.length < 2}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none truncate rounded-xl border border-white/10 bg-[#151515] px-3 pr-9 text-sm text-white outline-none transition focus:border-white/30 disabled:text-zinc-500"
        >
          {devices.length === 0 && <option value="">No device found</option>}
          {devices.map((device, index) => (
            <option value={device.deviceId} key={device.deviceId || index} className="bg-[#151515] text-white">
              {device.label || `${label} ${index + 1}`}
            </option>
          ))}
        </select>
        <CaretDown className="pointer-events-none absolute right-3 top-3.5 text-zinc-400" size={15} />
      </span>
    </label>
  );
}
