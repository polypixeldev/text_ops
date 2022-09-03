import React, {FC} from 'react';
import { useDrop, useDrag } from 'react-dnd';

interface OpProps {
	id: string,
	moveCard: (id: string, to: number, toBank: boolean) => void,
	findCard: (id: string) => { index: number },
	bank: boolean
}

export interface OpItem {
	id: string,
	originalIndex: number,
}

export const Op: FC<OpProps> = function Op({ id, moveCard, findCard, bank }) {
	const originalIndex = findCard(id).index;

	const [, drag] = useDrag(
		() => ({
			type: "op",
			item: { id, originalIndex },
			collect: (monitor) => ({
				isDragging: monitor.isDragging(),
			}),
			end: (item, monitor) => {
				const { id: droppedId, originalIndex } = item
				const didDrop = monitor.didDrop()
				if (!didDrop) {
					moveCard(droppedId, originalIndex, bank)
				}
			},
		}),
		[id, bank, originalIndex, moveCard],
	)

	const [, drop] = useDrop(
		() => ({
			accept: "op",
			hover({ id: draggedId }: OpItem) {
				if (draggedId !== id) {
					const { index: overIndex } = findCard(id)
					moveCard(draggedId, overIndex, bank)
				}
			},
		}),
		[findCard, moveCard],
	)

	return (
		<p ref={(node) => drag(drop(node))}>{id}</p>
	);
}