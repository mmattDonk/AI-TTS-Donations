// source: https://github.com/spacedriveapp/spacedrive/blob/af55f8d72d34005b056f0372bf8871d65832c415/apps/landing/src/components/Bubbles.tsx

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function Bubbles() {
	const particlesInit = async (main: any) => {
		await loadFull(main);
	};

	return (
		<Particles
			id="tsparticles"
			style={{ position: 'absolute', zIndex: 0 }}
			init={particlesInit}
			options={{
				fpsLimit: 120,
				interactivity: {
					events: {
						onClick: {
							enable: false,
							mode: 'push',
						},
						resize: false,
					},
				},
				particles: {
					color: {
						value: '#ffffff',
					},
					collisions: {
						enable: false,
					},
					move: {
						direction: 'top',
						enable: true,
						outModes: {
							default: 'destroy',
						},
						random: false,
						speed: 0.2,
						straight: true,
					},
					number: {
						density: {
							enable: true,
							area: 900,
						},
						value: 100,
					},
					opacity: {
						value: 0.1,
					},
					shape: {
						type: 'circle',
					},
					size: {
						value: { min: 0.5, max: 3 },
					},
				},
				detectRetina: true,
			}}
		/>
	);
}
