<template>
  <footer class="footer">
    <div class="container">
      <p class="copyright">
        All rights reserved © Joost van Driel {{ new Date().getFullYear() }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}

.footer :deep(a) {
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition: color 0.25s;
}

.footer :deep(a:hover) {
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .footer {
    padding: 32px;
  }
}

.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}

.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
