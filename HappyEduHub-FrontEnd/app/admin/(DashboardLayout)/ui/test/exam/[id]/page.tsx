export default function ExamDetail({ params }: { params: { id: string } }) {
    return (
        <span className="text-2xl font-bold">{params.id}</span>
    )
}