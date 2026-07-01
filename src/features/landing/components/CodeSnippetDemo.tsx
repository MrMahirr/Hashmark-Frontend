export function CodeSnippetDemo() {
  return (
    <section className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center px-1">
        <span className="font-mono text-[11px] font-medium text-hm-text-muted">
          src/PaymentProcessor.java
        </span>
      </div>
      <div className="bg-[#111827] rounded-card border-[0.5px] border-hm-border p-4 overflow-x-auto">
        <pre className="font-mono text-[13px] text-[#E5E7EB] leading-relaxed">
          <code>
            <span className="text-[#9CA3AF]">public</span> <span className="text-[#9CA3AF]">class</span> PaymentProcessor {"{"}
            {"\n"}
            {"    "}<span className="text-[#6B7280]">{"//"}</span> <span className="inline-block px-1.5 rounded-sm bg-hm-todo-bg text-hm-todo border-[0.5px] border-hm-todo/30">TODO: Refactor to use new Stripe API v3</span>
            {"\n"}
            {"    "}<span className="text-[#9CA3AF]">public</span> <span className="text-[#9CA3AF]">void</span> processPayment(Order order) {"{"}
            {"\n"}
            {"        "}<span className="text-[#9CA3AF]">if</span> (order.getAmount() {"<="} 0) {"{"}
            {"\n"}
            {"            "}<span className="text-[#6B7280]">{"//"}</span> <span className="inline-block px-1.5 rounded-sm bg-hm-fixme-bg text-hm-fixme border-[0.5px] border-hm-fixme/30">FIXME: Handle negative amounts properly</span>
            {"\n"}
            {"            "}<span className="text-[#9CA3AF]">throw</span> <span className="text-[#9CA3AF]">new</span> RuntimeException(<span className="text-[#34D399]">&quot;Invalid amount&quot;</span>);
            {"\n"}
            {"        "}{"}"}
            {"\n\n"}
            {"        "}<span className="text-[#6B7280]">{"//"}</span> <span className="inline-block px-1.5 rounded-sm bg-hm-hack-bg text-hm-hack border-[0.5px] border-hm-hack/30">HACK: Temporary workaround for legacy users</span>
            {"\n"}
            {"        "}<span className="text-[#9CA3AF]">if</span> (order.getUser().isLegacy()) {"{"}
            {"\n"}
            {"            "}applyLegacyDiscount(order);
            {"\n"}
            {"        "}{"}"}
            {"\n\n"}
            {"        "}<span className="text-[#6B7280]">{"//"}</span> <span className="inline-block px-1.5 rounded-sm bg-hm-xxx-bg text-hm-xxx border-[0.5px] border-hm-xxx/30">XXX: This might fail concurrently</span>
            {"\n"}
            {"        "}database.save(order);
            {"\n"}
            {"    "}{"}"}
            {"\n"}
            {"}"}
          </code>
        </pre>
      </div>
    </section>
  );
}
