export default function AboutUs() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>

      <p className="mb-6">
        Welcome to <span className="font-semibold">NoteShare</span> — your go-to
        platform for sharing and discovering high-quality academic notes. We aim
        to make education more accessible by enabling students and educators to
        exchange handwritten and digital study materials effortlessly.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📚 What We Do</h2>
        <p>
          On NoteShare, students can upload, browse, and download notes across a
          wide range of subjects and topics. Whether it’s a scanned notebook,
          revision sheets, or neatly written PDF notes — everything is easily
          accessible to help you study better.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🎯 Our Mission</h2>
        <p>
          Our mission is to build a supportive learning community where students
          help each other by sharing knowledge and resources. We believe
          education should be open, collaborative, and accessible to all.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">💡 Why NoteShare</h2>
        <p>
          Finding quality notes before exams can be stressful. NoteShare solves
          this by offering a student-driven platform with verified, useful
          content. Whether you&apos;re revising last minute or uploading your
          notes to help others — you’re part of something bigger.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🤝 Join the Community</h2>
        <p>
          By joining NoteShare, you’re not just using a tool — you&apos;re
          contributing to a movement of peer-to-peer learning and mutual growth.
        </p>
      </section>

      <section className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold mb-2">👨‍💻 Built With ❤️ by</h2>
        <p>
          I’m <span className="font-medium">Neelesh Pandey</span>, a Computer
          Science & Engineering student passionate about building web apps that
          solve real problems. I created NoteShare to make learning more
          collaborative and accessible. Connect with me on{" "}
          <a
            href="https://www.linkedin.com/in/neelesh-pandey-/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            LinkedIn
          </a>{" "}
          or drop a message anytime!
        </p>
      </section>
    </div>
  );
}
